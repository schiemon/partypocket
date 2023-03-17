import { UserProfile } from "@auth0/nextjs-auth0";

export default function Header(props: { user: UserProfile | undefined }) {
  let header_body = null;
  const { user } = props;
  if (!user) {
    header_body = <>You are currently not logged in.</>;
  } else {
    header_body = (
      <>
        Hello <strong>{user.nickname}</strong>!
      </>
    );
  }

  return (
    <header style={{ border: "1px solid red", padding: "1em" }}>
      {header_body}
    </header>
  );
}
