import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiHelper } from "../../../services";

import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import { setLogin } from "../../../redux/slice/userslice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignin = async () => {
    console.log("handleSignin called");
    if (!email.trim()) {
      toast.error("Please enter email");
      return;
    }

    if (!password.trim()) {
      toast.error("Please enter password");
      return;
    }

    setLoading(true);

    const requestBody = {
      email,
      password,
    };

    console.log("Request body:", requestBody);

    try {
      console.log("Calling apiHelper...");
      const { response, error } = await apiHelper(
        "POST",
        "auth/admin-sign-in",
        {},
        requestBody
      );

      console.log("API Response:", response);
      console.log("API Error:", error);

      if (response?.data?.status === 1 && response?.data?.data?.userAuthToken) {
        const userData = {
          userId: response.data.data._id,
          email: response.data.data.email,
          fullName: response.data.data.fullName,
          role: response.data.data.role,
          stripeCustomerId: response.data.data.stripeCustomerId,
          stripeAccountId: response.data.data.stripeAccountId,
          bankDetails: response.data.data.bankDetails,
          cards: response.data.data.cards,
          isActive: response.data.data.isActive,
          createdAt: response.data.data.createdAt,
          updatedAt: response.data.data.updatedAt,
        };

        dispatch(
          setLogin({
            user: userData,
            token: response.data.data.userAuthToken,
          })
        );

        toast.success(response.data.message || "Admin signed in successfully!");
        navigate("/dashboard");
      } else {
        toast.error(response?.data?.message || error || "Login failed.");
      }
    } catch (err) {
      console.error("Catch Error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignin();
  };

  return (
    <div className="loginPage min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="loginCard p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <img
                      src="src/assets/images/logo.png"
                      width={200}
                      height={80}
                      alt="Logo"
                    />

                    <h1>Login</h1>

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSignin()
                        }
                      />
                    </CInputGroup>

                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSignin()
                        }
                      />
                    </CInputGroup>

                    <CButton
                      color="cta"
                      className="px-4"
                      onClick={handleSignin}
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </CButton>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
