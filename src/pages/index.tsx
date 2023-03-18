import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import DateSelector from "~/components/DateSelector";
import { useState } from "react";

const Home: NextPage = () => {
  const { status } = useSession();

  const isAuthenticated = status === "authenticated";

  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);

  const post = api.posts.getByTitle.useQuery(
    { title: date },
    { enabled: isAuthenticated && date?.length > 0 }
  );

  const savePost = api.posts.save.useMutation();

  const postId = post.data?.id ?? 0;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const id = postId;
    const title = date;
    const content = formData.get("content")?.toString() ?? "";

    savePost.mutate({ id, title, content });
  };

  return (
    <>
      <Head>
        <title>My Diary</title>
      </Head>
      <main className="mx-auto max-w-md p-4">
        <Login />
        {isAuthenticated ? (
          <>
            <h1 className="mt-2 mb-4 text-3xl font-bold">My Diary</h1>
            <DateSelector selectedDate={date} onChange={setDate} />

            <form key={date} className="mt-4 flex flex-col" onSubmit={onSubmit}>
              <label htmlFor="content" className="sr-only">
                Content
              </label>
              <textarea
                className="mb-4 border-2 p-1"
                name="content"
                title="Content"
                defaultValue={post.data?.content}
                rows={5}
              />
              <button
                type="submit"
                className="rounded-sm bg-black/10 px-6 py-2 font-semibold no-underline transition hover:bg-black/20"
                disabled={savePost.isLoading}
              >
                {savePost.isLoading ? "Saving..." : "Save"}
              </button>
              {savePost.isError && (
                <p className="text-center text-red-500">
                  Error saving post. Try again.
                </p>
              )}
            </form>
          </>
        ) : (
          <p className="pt-4 text-center">Please sign in to view your diary.</p>
        )}
      </main>
    </>
  );
};

const Login: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-row items-center justify-between gap-4">
      <p className="text-2x">
        {sessionData && (
          <span>
            Hello,{" "}
            <span className="whitespace-nowrap">{sessionData.user?.name}</span>
          </span>
        )}
      </p>
      <button
        type="button"
        className="rounded-sm bg-black/10 px-6 py-2 font-semibold no-underline transition hover:bg-black/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

export default Home;
