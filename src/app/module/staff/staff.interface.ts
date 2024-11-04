export type TStaff = {
  email: string;
  image: string;
  name: string;
  phoneNo: string;
  designation: string;
  address: string;
  socialLink: {
    provider: "facebook" | "twitter" | "linkedin" | "instagram";
    link: string;
  }[];
};
