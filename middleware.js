// import { NextResponse } from "next/server"
import { auth } from '@/app/_lib/auth';


export const middleware = auth //auth serves as both middleware and session

export const config = {
  matcher: ["/account"]
}

// export function middleware(request) {
//   console.log(request)

//   return NextResponse.redirect(new URL("/about", request.url)) //next url and current url
// }