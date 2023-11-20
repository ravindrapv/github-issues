const owner = "ravindrapv";
const repo = "update-code-of-geetha";
const token = "update_with_my_token";

class GithubApi {
  constructor({ owner, repo, token }) {
    this.token = token;
    this.owner = owner;
    this.repo = repo;
  }

  async fetchIssues() {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching issues:", error.message);
      throw error;
    }
  }

  async createIssue({ title, body }) {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, body }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating issue:", error.message);
      throw error;
    }
  }

  async updateIssue({ issueId, title, body }) {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues/${issueId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, body }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating issue:", error.message);
      throw error;
    }
  }

  async closeIssue({ issueId }) {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues/${issueId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ state: "closed" }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error closing issue:", error.message);
      throw error;
    }
  }
}

const githubApi = new GithubApi({ token });

function toggleLoader(show) {
  const loader = document.getElementById("loader");
  loader.style.display = show ? "block" : "none";
}

async function fetchData(url, options = {}) {
  try {
    toggleLoader(true);
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error.message);
    showFlashMessage("An error occurred. Please try again.", "error");
    throw error;
  } finally {
    toggleLoader(false);
  }
}

async function showIssues() {
  try {
    const issues = await githubApi.fetchIssues();

    const issuesList = document.getElementById("issues-list");
    issuesList.innerHTML = "";

    issues.forEach((issue) => {
      const li = document.createElement("li");

      const issueDetails = document.createElement("div");
      issueDetails.classList.add("issue-details");

      const titleSpan = document.createElement("h2");
      titleSpan.classList.add("issue-title");
      titleSpan.textContent = issue.title;

      const descriptionDiv = document.createElement("p");
      descriptionDiv.classList.add("issue-description");
      descriptionDiv.textContent = issue.body; // Assuming "body" contains the description

      const editButton = document.createElement("button");
      editButton.classList.add("edit-button");
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => {
        editIssue(issue);
      });

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", async () => {
        await deleteIssue(issue.number);
      });

      issueDetails.appendChild(titleSpan);
      issueDetails.appendChild(descriptionDiv);

      li.appendChild(issueDetails);
      li.appendChild(editButton);
      li.appendChild(deleteButton);

      issuesList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching issues:", error.message);
  }
}

async function editIssue(issue) {
  try {
    const existingIssueData = issue;

    const modalIssueTitleInput = document.getElementById("modal-issue-title");
    const modalIssueBodyInput = document.getElementById("modal-issue-body");

    modalIssueTitleInput.value = existingIssueData.title;
    modalIssueBodyInput.value = existingIssueData.body;

    const modal = document.getElementById("myModal");
    modal.style.display = "block";

    window.updateIssue = async () => {
      try {
        await githubApi.updateIssue({
          issueId: issue.number,
          title: modalIssueTitleInput.value,
          body: modalIssueBodyInput.value,
        });

        modal.style.display = "none";
        showIssues();
        showFlashMessage("Issue updated successfully!");
      } catch (error) {
        console.error("Error updating issue:", error.message);
      }
    };
  } catch (error) {
    console.error("Error editing issue:", error.message);
  }
}

async function deleteIssue(issueId) {
  try {
    await githubApi.closeIssue({ issueId });
    showIssues();
    showFlashMessage("Issue closed successfully!");
  } catch (error) {
    console.error("Error deleting issue:", error.message);
  }
}

async function createAndShowIssue() {
  try {
    const issueTitleInput = document.getElementById("issue-title");
    const issueBodyInput = document.getElementById("issue-body");

    const newIssue = await githubApi.createIssue({
      title: issueTitleInput.value,
      body: issueBodyInput.value,
    });

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
      const issueId = checkbox.value;

      const existingIssues = await githubApi.fetchIssues();
      const existingIssueData = existingIssues.find(
        (issue) => issue.number == issueId
      );

      const modalIssueTitleInput = document.getElementById("modal-issue-title");
      const modalIssueBodyInput = document.getElementById("modal-issue-body");

      modalIssueTitleInput.value = existingIssueData.title;
      modalIssueBodyInput.value = existingIssueData.body;

      const modal = document.getElementById("myModal");
      modal.style.display = "block";

      window.updateIssue = async () => {
        try {
          await githubApi.updateIssue({
            issueId,
            title: modalIssueTitleInput.value,
            body: modalIssueBodyInput.value,
          });

          modal.style.display = "none";
          showIssues();
          showFlashMessage("Issue updated successfully!");
        } catch (error) {
          console.error("Error updating issue:", error.message);
        }
      };
    }
  } catch (error) {
    console.error("Error updating issues:", error.message);
  }
}

document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("myModal").style.display = "none";
});

window.onclick = (event) => {
  const modal = document.getElementById("myModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

async function deleteSelectedIssues() {
  try {
    const checkboxes = document.querySelectorAll(
      '#issues-list input[type="checkbox"]:checked'
    );

    for (const checkbox of checkboxes) {
      const issueId = checkbox.value;

      await githubApi.closeIssue({ issueId });
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
