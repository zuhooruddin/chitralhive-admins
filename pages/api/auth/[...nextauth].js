import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

async function refreshAccessTokenCredentials(token) {
  const url = process.env.NEXT_PUBLIC_BACKEND_API_BASE + 'api/auth/token/refresh/'
  const payload = {
    refresh: token.refreshToken
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }

    })
    const refreshedTokens = await response.json()
    if (!response.ok) {
      throw refreshedTokens
    }
    return {
      ...token,
      error: undefined,
      accessToken: refreshedTokens.access,
      // accessTokenExpires: Date.now() + refreshedTokens.expires_at * 1000,
      accessTokenExpires: Math.floor(new Date(refreshedTokens.access_token_expiration)), //refreshedTokens.access_token_expiration,
      refreshToken: refreshedTokens.refresh ?? token.refreshToken, // Fall back to old refresh token
    }
  } catch (error) {

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }

}
export default NextAuth({
  secret: process.env.JWT_SECRET,


  providers: [
    // CredentialsProvider({

    //   name: 'Email and Password',
    //   credentials: {
    //     email: { label: 'Email', type: 'text'},
    //     password: { label: 'Password', type: 'password' }
    //   },
    //   // This is were you can put your own external API call to validate Email and Password
    //   authorize: async (credentials) => {
    //     if (credentials.email === 'user@email.com' && credentials.password === '123') {
    //       return { id: 11, name: 'User', email: 'user@email.com'} 
    //     }

    //     return null;

    //   }
    // }),
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        username: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        const payload = {
          username: credentials.username,
          password: credentials.password,
          role: credentials.role
        };
        const url = process.env.NEXT_PUBLIC_BACKEND_API_BASE + 'api/auth/login/'
        const res = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" }
        })
        const user = await res.json()
        if (res.ok && user) {
          return user;
        }
        return null;
      }
    }),

  ],
  theme: {
    colorScheme: "dark",
  },
  pages: {
    signIn: '/login',
    //    signOut: '/signout',

  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },

    async jwt({ token, user, account }) {
      if (account?.provider === 'credentials') {
        if (user && account) {
          // first time -> 
          token = Object.assign(Object.assign({}, token), 
                { accessToken:user.access_token,
                  refreshToken: user.refresh_token, 
                  accessTokenExpires: Math.floor(new Date(user.access_token_expiration)) - 0.5*60*1000, 
                  refreshTokenExpires:Math.floor(new Date(user.refresh_token_expiration)),
                  user: user.user,
                  provider:account.provider });
                return token;
          // token = Object.assign(Object.assign({}, token), { accessToken: user.access_token, refreshToken: user.refresh_token, accessTokenExpires: Date.now() + process.env.ACCESS_TOKEN_LIFETIME * 1000 * 60 - 1 * 60 * 1000, user: user.user, provider: account.provider });
          // return token;
        }
      }
      // Initial sign in
      if (account && user && account.provider === 'google') {
        // make a POST request to the DRF backend
        const response = await axios({
          method: 'post',
          url: process.env.NEXT_PUBLIC_BACKEND_API_BASE + 'google/',
          data: {
            access_token: account.access_token,
            id_token: account.id_token,
          }
        }
        );

        const { access_token, refresh_token, user } = response.data;
        user.name = token.name;
        user.picture = token.picture;
        token = Object.assign(Object.assign({}, token), 
                { accessToken:user.access_token,
                  refreshToken: user.refresh_token, 
                  accessTokenExpires: Math.floor(new Date(user.access_token_expiration)) - 0.5*60*1000, 
                  refreshTokenExpires:Math.floor(new Date(user.refresh_token_expiration)),
                  user: user.user,
                  provider:account.provider });
                return token;
      }

      // Return previous token if the access token has not expired yet

      // Return previous token if the access token has not expired yet
      
     if (Date.now() >= token.refreshTokenExpires) {

      return {
         ...token,
        // Return an error code 
        accessToken : undefined,
        refreshToken : undefined,
        user : undefined,
         error: "SessionTimedOut",
        }
    }
    if (Date.now() < token.accessTokenExpires) {
      return token
    }
      return refreshAccessTokenCredentials(token)
    },


    async session({ session, token, user }) {
      session.user = token.user
      session.accessToken = token.accessToken
      session.error = token.error


      const url = process.env.NEXT_PUBLIC_BACKEND_API_BASE + "getGeneralSetting";

      if (session.accessToken) {
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const logo = await response.json();
       
            session.logodata =logo[0].site_logo;
          } else {
          }
        } catch (error) {
        }
      }







      if (session.error === 'SessionTimedOut'){
        session.accessToken = undefined;
        session.refreshToken = undefined;
        session.user = undefined;
      }
      session.expires = new Date(token.accessTokenExpires).toISOString();
      session.accessTokenExpires = token.accessTokenExpires;
      // session.expires = new Date(token.accessTokenExpires).toISOString();
      return session
    },
  },

})
