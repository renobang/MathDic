import {createRemoteJWKSet,jwtVerify} from 'jose';
export async function verifyAdmin(request,env,keySet){
 if(!env.ACCESS_TEAM_DOMAIN||!env.ACCESS_AUD||!env.ADMIN_EMAIL)throw Error('Admin unavailable');
 const token=request.headers.get('cf-access-jwt-assertion');
 if(!token)throw Error('Authentication required');
 const keys=keySet||createRemoteJWKSet(new URL('/cdn-cgi/access/certs',env.ACCESS_TEAM_DOMAIN));
 const {payload}=await jwtVerify(token,keys,{issuer:env.ACCESS_TEAM_DOMAIN,audience:env.ACCESS_AUD,algorithms:['RS256'],requiredClaims:['exp','iat','sub','email']});
 if(typeof payload.email!=='string'||payload.email.toLowerCase()!==env.ADMIN_EMAIL.toLowerCase())throw Error('Not an administrator');
 return payload.email.toLowerCase();
}
