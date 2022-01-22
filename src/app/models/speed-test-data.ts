export class SpeedTestData {
  public averageDownload: number;
  public minDownload: number;
  public maxDownload: number;
  public median: number;
  public geoLocalization: string;
  public testTime: Date;

  constructor(averageDownload: number, minDownload: number, maxDownload: number, median: number, geoLocalization: string) {
    this.averageDownload = averageDownload;
    this.minDownload = minDownload;
    this.maxDownload = maxDownload;
    this.median = median;
    this.geoLocalization = geoLocalization;
  }
}
