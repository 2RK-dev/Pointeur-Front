let xlsxModule: any = null

export async function loadXLSX() {
  if (!xlsxModule) {
    xlsxModule = await import("xlsx")
  }
  return xlsxModule
}
