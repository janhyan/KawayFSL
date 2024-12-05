import { Button } from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../src/auth/authContext";
import axios from "axios";

export default function Navbar() {
  const { user, signOut, token } = useContext(AuthContext);
  const [userImage, setUserImage] = useState(null);
  const accessToken = token;
  const [file, setFile] = useState();

  const navigate = useNavigate();
  const goSignOut = () => {
    signOut();
    navigate("/signin");
  };

  useEffect(() => {
    const cachedImage = sessionStorage.getItem("userImage");

    if (cachedImage) {
      setUserImage(cachedImage);
    } else {
      const fetchImage = async () => {
        try {
          const response = await axios.get(
            `https://d3soyatq5ls79q.cloudfront.net/${user.sub}.png`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
              responseType: "arraybuffer",
            }
          );

          const base64String = btoa(
            new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          );
          const imageSrc = `data:image/png;base64,${base64String}`;
          setUserImage(imageSrc);
          sessionStorage.setItem("userImage", imageSrc);
        } catch (err) {
          setUserImage("user.png");
          console.error(err);
        }
      };
      fetchImage();
    }
  }, [accessToken, user?.sub]);

  // Submit the form when the file state is updated
  useEffect(() => {
    if (file) {
      const form = document.getElementById("user-upload");
      if (form) {
        form.requestSubmit();
      }
    }
  }, [file]);

  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      console.error("No file selected");
      return;
    }

    try {
      // Get the presigned URL
      const presignedUrl = await getPresignedUrl(`${user.sub}.png`);
      console.log(presignedUrl);
      // Upload the file to S3 using the presigned URL
      await uploadFileToUrl(file, presignedUrl);
      sessionStorage.removeItem("userImage");
      console.log("File uploaded successfully.");
    } catch (error) {
      console.error("Error during file upload:", error.message);
    }
  }

  return (
    <nav className="side-nav container">
      <div className="side-nav header">
        <h1 id="side-nav-title" href="#HOME">
          Kaway<b className="title-period">.</b>
        </h1>
      </div>
      <div className="side-nav contents">
        <Button className="home buttons" as={Link} to="/">
          Home
        </Button>
        <Button className="lessons buttons" as={Link} to="/modules">
          Lessons
        </Button>
        <Button className="practice buttons" as={Link} to="/practice">
          Practice
        </Button>
        <Button className="settings buttons" as={Link} to="/settings">
          Settings
        </Button>
      </div>
      <div className="side-nav footer">
        <div className="heading">
          <div className="avatar">
            <form id="user-upload" onSubmit={handleSubmit}>
              <label htmlFor="profile-input" className="add-image">
                +
              </label>
              <input
                type="file"
                className="add-image-input"
                id="profile-input"
                onChange={handleChange}
              />
              {/* <button className="image-button" type="submit">
                +
              </button> */}
            </form>
            {userImage ? (
              <img className="user-img" src={userImage} alt="User profile" />
            ) : (
              <img className="user-img" src="public" alt="User profile" />
            )}
          </div>
          <div className="user-details">
            <p className="username">{user?.given_name}</p>
            <p className="role">Student</p>
          </div>
          <div className="footer-toggle">
            <input
              type="checkbox"
              name="footer-checkbox"
              id="footer-caret"
              onClick={slideFooter}
            />
            <label htmlFor="footer-caret" className="slide-icon" />
          </div>
        </div>
        <div className="footer content">
          <p>
            Name: {user?.given_name} {user?.family_name}
            <br />
            E-mail: {user?.email}
          </p>
          <Button className="signout buttons" onClick={goSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
}

/* Function to slide the side-nav footer */
function slideFooter() {
  const footerToggle = document.getElementById("footer-caret");
  const footer = document.querySelector(".side-nav.footer");

  let id = null;
  let initialUp = -60;
  let initialDown = 0;
  clearInterval(id);

  if (footerToggle.checked === true) {
    id = setInterval(slideUp, 10);
  } else {
    id = setInterval(slideDown, 10);
  }

  function slideUp() {
    if (initialUp === 0) {
      clearInterval(id);
    } else {
      initialUp++;
      footer.style.bottom = initialUp + "%";
    }
  }

  function slideDown() {
    if (initialDown === -60) {
      clearInterval(id);
    } else {
      initialDown--;
      footer.style.bottom = initialDown + "%";
    }
  }
}

async function getPresignedUrl(fileName) {
  try {
    const params = { key: fileName };

    const config = {
      method: "post",
      url: "https://alb.kawayfsl.com/v1/generateWebFormS3URL",
      headers: {
        "Content-Type": "application/json",
      },
      data: params,
    };

    const result = await axios.request(config);

    if (result.data.status === "Success") {
      return result.data.presignedUrl; // Presigned URL
    } else {
      throw new Error(
        `Failed to obtain presigned URL. Status: ${result.data.status}`
      );
    }
  } catch (error) {
    console.error("Error obtaining presigned URL:", error.message);
    throw error;
  }
}

async function uploadFileToUrl(file, url) {
  try {
    const response = await axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    console.log("File upload successful. Response:", response.status);
  } catch (error) {
    console.error("Error uploading file:", error.message);
    throw error;
  }
}
