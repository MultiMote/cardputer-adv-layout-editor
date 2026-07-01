export const pickFileAsync = async (acceptExtension: string, multiple: boolean): Promise<FileList> => {
  return new Promise((resolve) => {
    const input: HTMLInputElement = document.createElement("input");

    input.type = "file";
    input.multiple = multiple;

    if (acceptExtension !== "*") {
      input.accept = `.${acceptExtension}`;
    }

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files !== null && target.files.length > 0) {
        resolve(target.files);
      }
    };
    input.click();
  });
};

export const pickAndReadTextFile = async (acceptExtension: string): Promise<string> => {
  const fileList = await pickFileAsync(acceptExtension, false);

  if (fileList.length === 0) {
    throw new Error("No file selected");
  }

  const ext = fileList[0].name.split(".").pop();
  if (ext !== acceptExtension) {
    throw new Error(`Only ${acceptExtension} allowed`);
  }

  return await fileList[0].text();
};

export const downloadText = async (filename: string, mime: string, text: string) => {
  const blob = new Blob([text], { type: mime });

  const a = document.createElement("a");
  a.download = filename;
  a.href = URL.createObjectURL(blob);
  a.click();

  setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 10_000);
};
