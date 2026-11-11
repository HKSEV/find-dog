// 💡 휴대폰 사진은 몇 MB씩 해서 서버 기본 업로드 제한(파일당 1MB)에 걸리므로
//    긴 변을 MAX_SIDE로 줄이고 JPEG로 다시 저장해서 1MB 안쪽으로 맞춤

const MAX_SIDE = 1600;
const MAX_BYTES = 950 * 1024;

const loadImage = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("사진을 읽지 못했어요."));
    };
    image.src = url;
  });

const toBlob = (canvas: HTMLCanvasElement, quality: number) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));

export const compressImage = async (file: File): Promise<File> => {
  // 이미 충분히 작은 JPEG는 그대로
  if (file.type === "image/jpeg" && file.size <= MAX_BYTES) return file;

  const image = await loadImage(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);

  // 화질을 조금씩 낮추며 1MB 안쪽이 될 때까지 시도
  let blob: Blob | null = null;
  for (const quality of [0.85, 0.75, 0.65, 0.5]) {
    blob = await toBlob(canvas, quality);
    if (blob && blob.size <= MAX_BYTES) break;
  }
  if (!blob) throw new Error("사진을 줄이지 못했어요.");

  const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], name, {type: "image/jpeg"});
};
