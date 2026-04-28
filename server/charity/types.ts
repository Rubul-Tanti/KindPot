
type ImageMeta = {
  altText: string;
  order: number;
};
export interface charityPayload {
  name: string;
  description: string;
  websiteUrl: string;
  country: string;
  isActive: boolean;
  isFeatured: boolean;
    images:ImageMeta[]
    files:File[]
}
type CharityImages={
        id:string,
        url:string,
        altText:string,
        order:number,
        createdAt:string,
        charityId:string,
    }
type Charity = {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
  country: string;

  isFeatured: boolean;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;

  images: {
    id: string;
    url: string;
    altText: string;
    order: number;
    createdAt: string;
  }[];

  userCharities: [];
};

export type getAllCharitiesResponse={
  data:Charity[],
   message:string,
   pagination:{
      total:number,
      page:number,
      limit:number,
      pages:number,
      hasNext:boolean,
        hasPrev:boolean}

}
