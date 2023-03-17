import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";
import Header from "../components/Header";

export default function Index({ ...pageProps }) {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  let body = null;

  if (user) {
    body = (
      <div>
        Welcome {user.name}! <br />
        <a href={"/api/auth/logout"}>
          <button>Logout</button>
        </a>
        <br />
        <hr />
        <Link href={"/parties"}>
          <a>Your parties ➡️</a>
        </Link>
      </div>
    );
  } else {
    body = (
      <a href={"/api/auth/login"}>
        <button>Login</button>
      </a>
    );
  }

  return (
    <>
      <Header user={user} />
      {body}
    </>
  );
}
