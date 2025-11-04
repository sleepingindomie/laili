import Image from "next/image";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function Logo({
  className = "",
  width = 120,
  height = 40,
  priority = false
}: LogoProps) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src="/LailiLogo.png"
        alt="Laili Brand"
        width={width}
        height={height}
        priority={priority}
        className="object-contain"
      />
    </div>
  );
}
