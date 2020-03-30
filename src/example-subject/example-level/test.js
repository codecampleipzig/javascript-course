check(
  "wordBucket('Hello World')",
  () => wordBucket("Hello World"),
  assertEqual("Hello World")
);
