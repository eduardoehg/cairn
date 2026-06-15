/** API health-check response. First contract crossing back/front. */
export interface ApiInfo {
  name: string;
  version: string;
  status: 'ok';
}
