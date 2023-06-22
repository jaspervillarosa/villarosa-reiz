// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string;
  region: string;
  area:number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  try{
      const response = await fetch('https://restcountries.com/v2/all?fields=name,region,area')
      const data = await response.json();
      res.status(200).json(data)
  }catch(e: any){
    console.log(e)
}
}
