import { createClient } from '@/lib/supabase/client';

export interface ImageUploadOptions {
  bucket?: string;
  folder?: string;
  maxSizeKB?: number;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

const DEFAULT_OPTIONS: Required<ImageUploadOptions> = {
  bucket: 'images',
  folder: 'uploads',
  maxSizeKB: 5000, // 5MB
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.85,
};

/**
 * Compress and resize image before upload
 */
export async function compressImage(
  file: File,
  options: Partial<ImageUploadOptions> = {}
): Promise<Blob> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Calculate new dimensions
        if (width > opts.maxWidth || height > opts.maxHeight) {
          const ratio = Math.min(opts.maxWidth / width, opts.maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            resolve(blob);
          },
          file.type,
          opts.quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
}

/**
 * Upload image to Supabase Storage with automatic compression
 */
export async function uploadImage(
  file: File,
  options: Partial<ImageUploadOptions> = {}
): Promise<{ url: string; path: string }> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const supabase = createClient();

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Validate file size
  const fileSizeKB = file.size / 1024;
  if (fileSizeKB > opts.maxSizeKB) {
    throw new Error(`File size must be less than ${opts.maxSizeKB}KB`);
  }

  // Compress image
  const compressedBlob = await compressImage(file, options);

  // Generate unique filename
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(7);
  const fileExt = file.name.split('.').pop();
  const fileName = `${timestamp}-${randomStr}.${fileExt}`;
  const filePath = `${opts.folder}/${fileName}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(opts.bucket)
    .upload(filePath, compressedBlob, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(opts.bucket)
    .getPublicUrl(filePath);

  return {
    url: urlData.publicUrl,
    path: filePath,
  };
}

/**
 * Delete image from Supabase Storage
 */
export async function deleteImage(
  path: string,
  bucket: string = 'images'
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    console.error('Delete error:', error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

/**
 * Get optimized image URL with transformations
 */
export function getOptimizedImageUrl(
  url: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif';
  }
): string {
  if (!url) return '';

  // If it's a Supabase Storage URL, add transformation params
  if (url.includes('supabase.co/storage/v1/object/public/')) {
    const params = new URLSearchParams();

    if (options?.width) params.append('width', options.width.toString());
    if (options?.height) params.append('height', options.height.toString());
    if (options?.quality) params.append('quality', options.quality.toString());
    if (options?.format) params.append('format', options.format);

    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  return url;
}

/**
 * Generate responsive srcset for images
 */
export function generateSrcSet(
  url: string,
  widths: number[] = [640, 750, 828, 1080, 1200, 1920]
): string {
  return widths
    .map((width) => {
      const optimizedUrl = getOptimizedImageUrl(url, { width, quality: 75 });
      return `${optimizedUrl} ${width}w`;
    })
    .join(', ');
}
