import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalFooter,
  CSpinner,
  CFormTextarea,
  CFormInput,
  CFormLabel,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilSave } from '@coreui/icons'

import { apiHelper } from '../../services'
import { toast } from 'react-toastify'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('about')
  const [contentData, setContentData] = useState([])
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editingType, setEditingType] = useState('')
  const [editingContent, setEditingContent] = useState('')
  const [perMileFare, setPerMileFare] = useState('2.50')
  const [petCharges, setPetCharges] = useState('10.00')

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    setLoading(true)
    try {
      const { response, error } = await apiHelper('GET', `/admin/moderation/content`)

      if (response?.data?.status === 1) {
        setContentData(response.data.data || [])
      } else {
        toast.error(response?.data?.message || error || 'Failed to fetch content.')
      }
    } catch (err) {
      console.error('Catch Error:', err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getContentByType = (type) => {
    return contentData.find((item) => item.type === type)
  }

  const handleEdit = (type) => {
    const content = getContentByType(type)
    setEditingType(type)
    setEditingContent(content?.content || '')
    setEditModal(true)
  }

  const handleSave = async () => {
    setSaveLoading(true)
    const body = {
      privacyPolicy:
        editingType === 'privacy-policy'
          ? editingContent
          : getContentByType('privacy-policy')?.content || '',
      termCondition:
        editingType === 'terms-and-conditions'
          ? editingContent
          : getContentByType('terms-and-conditions')?.content || '',
    }

    try {
      const { response, error } = await apiHelper(
        'POST',
        `admin/update-content`,
        {},
        body,
      )

      if (response?.data?.status === 1) {
        toast.success(response.data.message || 'Content updated successfully.')
        setEditModal(false)
        fetchContent()
      } else {
        toast.error(response?.data?.message || error || 'Failed to update.')
      }
    } catch (err) {
      console.error('Catch Error:', err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSaveLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="settingsPage">
        <h4 className="heading mb-3">Settings</h4>
        <div className="text-center">
          <CSpinner />
        </div>
      </div>
    )
  }

  return (
    <div className="settingsPage">
      <h4 className="heading mb-3">Settings</h4>
      <CRow className="mb-3">
        <CCol lg={4} md={5} xs={12} className='mb-2'>
          <CNav variant="tabs" className="myTabs">
            <CNavItem>
              <CNavLink active={activeTab === 'about'} onClick={() => setActiveTab('about')}>
                About Us
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink active={activeTab === 'terms'} onClick={() => setActiveTab('terms')}>
                Terms & Conditions
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink active={activeTab === 'privacy'} onClick={() => setActiveTab('privacy')}>
                Privacy Policy
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink active={activeTab === 'fares'} onClick={() => setActiveTab('fares')}>
                Fares & Charges
              </CNavLink>
            </CNavItem>
          </CNav>
        </CCol>
        <CCol lg={8} md={7} xs={12} className='mb-2'>
          <CTabContent>
            {/* About Us Tab */}
            <CTabPane visible={activeTab === 'about'}>
              <div className="aboutUs">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h1>About Us</h1>
                  <CButton color="cta" className="cta cta2" onClick={() => handleEdit('about-us')}>
                    <CIcon icon={cilPencil} className="me-2" />
                    Edit
                  </CButton>
                </div>
                <p>{getContentByType('about-us')?.content || 'No content available.'}</p>
              </div>
            </CTabPane>

            {/* Terms Tab */}
            <CTabPane visible={activeTab === 'terms'}>
              <div className="aboutUs">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h1>Terms & Conditions</h1>
                  <CButton
                    color="cta"
                    className="cta cta2"
                    onClick={() => handleEdit('terms-and-conditions')}
                  >
                    <CIcon icon={cilPencil} className="me-2" />
                    Edit
                  </CButton>
                </div>
                <p>
                  {getContentByType('terms-and-conditions')?.content || 'No content available.'}
                </p>
              </div>
            </CTabPane>

            {/* Privacy Tab */}
            <CTabPane visible={activeTab === 'privacy'}>
              <div className="aboutUs">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h1>Privacy Policy</h1>
                  <CButton
                    color="cta"
                    className="cta cta2"
                    onClick={() => handleEdit('privacy-policy')}
                  >
                    <CIcon icon={cilPencil} className="me-2" />
                    Edit
                  </CButton>
                </div>
                <p>{getContentByType('privacy-policy')?.content || 'No content available.'}</p>
              </div>
            </CTabPane>

            {/* Fares & Charges Tab */}
            <CTabPane visible={activeTab === 'fares'}>
              <div className="faresCharges">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h1>Fares & Charges</h1>
                  <CButton color="cta" className="cta cta2">
                    <CIcon icon={cilSave} className="me-2" />
                    Save Changes
                  </CButton>
                </div>
                <CRow>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="perMileFare">Per Mile Fare ($)</CFormLabel>
                      <CFormInput
                        id="perMileFare"
                        type="number"
                        step="0.01"
                        value={perMileFare}
                        onChange={(e) => setPerMileFare(e.target.value)}
                      />
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="petCharges">Pet Charges ($)</CFormLabel>
                      <CFormInput
                        id="petCharges"
                        type="number"
                        step="0.01"
                        value={petCharges}
                        onChange={(e) => setPetCharges(e.target.value)}
                      />
                    </div>
                  </CCol>
                </CRow>
              </div>
            </CTabPane>
          </CTabContent>
        </CCol>
      </CRow>

      {/* Edit Modal */}
      <CModal visible={editModal} onClose={() => setEditModal(false)}>
        <CModalHeader>
          Edit
          {editingType === 'about-us'
            ? 'About Us'
            : editingType === 'terms-and-conditions'
              ? 'Terms & Conditions'
              : 'Privacy Policy'}
        </CModalHeader>
        <CModalBody>
          <CFormTextarea
            rows={10}
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            placeholder="Enter content here..."
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModal(false)}>
            Cancel
          </CButton>
          <CButton color="cta" className="cta cta2" onClick={handleSave} disabled={saveLoading}>
            {saveLoading ? <CSpinner size="sm" /> : 'Save'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Settings
