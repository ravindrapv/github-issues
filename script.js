const owner = "ravindrapv";
const repo = "update-code-of-geetha";
const token =
  "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";
async function showIssues() {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues`
  );
  const issues = await response.json();

  const issuesList = document.getElementById("issues-list");
  issuesList.innerHTML = "";

  issues.forEach((issue) => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = issue.number;
    li.appendChild(checkbox);

    const titleSpan = document.createElement("span");
    titleSpan.textContent = issue.title;
    li.appendChild(titleSpan);

    issuesList.appendChild(li);
  });
}

async function createAndShowIssue() {
  const issueTitleInput = document.getElementById("issue-title");
  const issueBodyInput = document.getElementById("issue-body");

  const issueData = {
    title: issueTitleInput.value,
    body: issueBodyInput.value,
  };

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(issueData),
    }
  );

  const newIssue = await response.json();
  console.log("New issue created:", newIssue);

  showIssues();
}

async function updateSelectedIssues() {
  const checkboxes = document.querySelectorAll(
    '#issues-list input[type="checkbox"]:checked'
  );

  for (const checkbox of checkboxes) {
    const issueNumber = checkbox.value;

    const issueTitleInput = document.getElementById("issue-title");
    const issueBodyInput = document.getElementById("issue-body");

    const updateData = {
      title: issueTitleInput.value,
      body: issueBodyInput.value,
    };

    await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    );
  }

  showIssues();
}

async function deleteSelectedIssues() {
  const checkboxes = document.querySelectorAll(
    '#issues-list input[type="checkbox"]:checked'
  );

  for (const checkbox of checkboxes) {
    const issueNumber = checkbox.value;

    await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  showIssues();
}
showIssues();
// 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;
