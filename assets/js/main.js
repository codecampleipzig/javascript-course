function log(message) {
  document.getElementById("console-output").textContent +=
    String(message) + "\n";
}

var test = {
  cases: []
};

function check(expressionSource, expression, check) {
  test.cases.push({
    expressionSource,
    expression,
    check
  });
}

function assertEqual(value) {
  return v => {
    if (v == value) return true;
    else return `Expected ${value}`;
  };
}

// Load code files & run them
document.querySelectorAll(".code-file").forEach(codePre => {
  const url =
    document.URL.substr(0, document.URL.lastIndexOf("/")) +
    "/" +
    codePre.dataset.file;

  fetch(url)
    .then(res => res.text())
    .then(script => {
      codePre.textContent = script;

      try {
        window.eval(script);

        let failed = false;

        test.cases.forEach(testCase => {
          log(testCase.expressionSource);
          const result = testCase.expression();
          log(`-> ${result}`);
          const testResult = testCase.check(result);
          if (testResult === true) {
            log("Test passed!");
          } else {
            log(testResult);
            failed = true;
          }
        });

        if (!failed) {
          log("\nAll tests passed.");
          document.body.classList.add("completed");
        }
      } catch (error) {
        log(error);
      }
    });
});
