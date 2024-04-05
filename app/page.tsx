export default function Home() {
  return (
    <div className=" max-w-screen-sm flex flex-col group">
      {[1, 2, 3].map((each) => (
        <button className="btn">a</button>
      ))}
      <a>asdf</a>
      <input></input>
    </div>
  );
}
