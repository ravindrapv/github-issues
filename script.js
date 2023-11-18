const owner = "ravindrapv";
const repo = "update-code-of-geetha";
const token =
  "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";
async function fetchData(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error.message);
    showFlashMessage("An error occurred. Please try again.", "error");
    throw error;
  }
}

async function showIssues() {
  try {
    const issues = await fetchData(
      `https://api.github.com/repos/${owner}/${repo}/issues`
    );

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
  } catch (error) {
    console.error("Error fetching issues:", error.message);
  }
}

async function createAndShowIssue() {
  try {
    const issueTitleInput = document.getElementById("issue-title");
    const issueBodyInput = document.getElementById("issue-body");

    const issueData = {
      title: issueTitleInput.value,
      body: issueBodyInput.value,
    };

    const newIssue = await fetchData(
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

    console.log("New issue created:", newIssue);
    showIssues();
    showFlashMessage("Issue created successfully!");
  } catch (error) {
    console.error("Error creating issue:", error.message);
  }
}

async function updateSelectedIssues() {
  try {
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

      await fetchData(
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
    location.reload();
    showFlashMessage("Issues updated successfully!");
  } catch (error) {
    console.error("Error updating issues:", error.message);
  }
}

async function deleteSelectedIssues() {
  try {
    const checkboxes = document.querySelectorAll(
      '#issues-list input[type="checkbox"]:checked'
    );

    for (const checkbox of checkboxes) {
      const issueNumber = checkbox.value;

      await fetchData(
        `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            state: "closed",
          }),
        }
      );
    }

    showIssues();
    showFlashMessage("Issue(s) closed successfully!");
  } catch (error) {
    console.error("Error deleting issues:", error.message);
  }
}

function showFlashMessage(message, messageType = "success") {
  const flashMessage = document.getElementById("flash-message");
  flashMessage.textContent = message;
  flashMessage.style.display = "block";
  flashMessage.style.padding = "10px";
  flashMessage.style.margin = "10px 0";
  flashMessage.style.borderRadius = "5px";
  if (messageType === "success") {
    flashMessage.style.backgroundColor = "#4CAF50";
    flashMessage.style.color = "#fff";
  } else if (messageType === "error") {
    flashMessage.style.backgroundColor = "#ff5252";
    flashMessage.style.color = "#fff";
  }
  setTimeout(() => {
    flashMessage.style.display = "none";
  }, 5000);
}
showIssues();
// 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;
