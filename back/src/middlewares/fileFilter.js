const allowedExtensions = [
  ".jpg",
  ".JPG",
  ".jpeg",
  ".JPEG",
  ".png",
  ".PNG",
  ".gif",
  ".GIF",
  ".bmp",
  ".BMP",
];

function fileFilter(req, file, cb) {
  //파일명이 허용된 확장자로 끝나는지 확인
  const isAllowed = allowedExtensions.some((ext) =>
    file.originalname.endsWith(ext)
  );

  if (isAllowed) {
    //허용
    cb(null, true);
  } else {
    cb(new Error("이미지 파일 확장자가 아님"));
  }
}

module.exports = fileFilter;
