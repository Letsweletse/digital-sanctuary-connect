
export interface LeadershipPerson {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  email?: string;
  phone?: string;
  isSeniorPastor?: boolean;
}

export interface LeaderData {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  email?: string;
  phone?: string;
}
