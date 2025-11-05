import React, { useState } from 'react'
import { CButton, CForm, CFormInput, CCol } from '@coreui/react'
import { toast } from 'react-toastify'
import { apiHelper } from '../../services'

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChangePassword = async (e) => {
    e.preventDefault()

    if (!oldPassword.trim()) {
      toast.error('Please enter old password')
      return
    }
    if (!newPassword.trim()) {
      toast.error('Please enter new password')
      return
    }

    setLoading(true)

    const requestBody = {
      oldPassword,
      newPassword,
    }

    try {
      const { response, error } = await apiHelper(
        'PATCH',
        '/admin/change-password',
        {},
        requestBody,
      )

      if (response?.data?.status === 1) {
        toast.success(response.data.message || 'Password changed successfully!')
        setOldPassword('')
        setNewPassword('')
      } else {
        toast.error(response?.data?.message || error || 'Failed to change password.')
      }
    } catch (err) {
      console.error('Catch Error:', err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="passwordWrapper">
      <h4 className="heading mb-3">Change Password</h4>
      <CForm onSubmit={handleChangePassword}>
        <CCol md={6} className="mb-3">
          <CFormInput
            type="password"
            label="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter old password"
          />
        </CCol>
        <CCol md={6} className="mb-3">
          <CFormInput
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </CCol>
        <CCol md={6} className="mb-3">
          <CButton type="submit" color="cta" disabled={loading}>
            {loading ? 'Updating...' : 'Change Password'}
          </CButton>
        </CCol>
      </CForm>
    </div>
  )
}

export default ChangePassword
