import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CBadge,
  CSpinner,
  CInputGroup,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilPencil, cilTrash, cilArrowRight, cilSearch } from '@coreui/icons'
import { apiHelper } from '../../services'
import { toast } from 'react-toastify'

const FAQ = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedFaq, setSelectedFaq] = useState(null)
  const [editQuestion, setEditQuestion] = useState('')
  const [editAnswer, setEditAnswer] = useState('')
  const [createQuestion, setCreateQuestion] = useState('')
  const [createAnswer, setCreateAnswer] = useState('')
  const [toggleLoading, setToggleLoading] = useState({})
  const [searchTerm, setSearchTerm] = useState('')

  const fetchFAQs = async (page = 1, search = '') => {
    setLoading(true)
    try {
      const searchParam = search ? `&search=${search}` : ''
      const { response, error } = await apiHelper('GET', `/admin/faqs?page=${page}&limit=10${searchParam}`)

      if (response?.data?.status === 1) {
        setFaqs(response.data.data.results || [])
        setTotalPages(response.data.data.totalPages || 1)
      } else {
        toast.error(response?.data?.message || error || 'Failed to fetch FAQs.')
      }
    } catch (err) {
      console.error('Catch Error:', err)
      toast.error(err?.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFAQs(currentPage)
  }, [currentPage])

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchFAQs(1, searchTerm)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(delayDebounce)
  }, [searchTerm])

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return <CBadge className="medium">Active</CBadge>
    } else {
      return <CBadge className="high">Inactive</CBadge>
    }
  }

  const handleToggleStatus = async (faqId) => {
    try {
      setToggleLoading((prev) => ({ ...prev, [faqId]: true }))
      const { response, error } = await apiHelper('PATCH', `/admin/faqs/${faqId}/toggle-status`)

      if (error) {
        toast.error(error || 'Failed to toggle FAQ status.')
        return
      }

      if (response?.data?.status === 1) {
        setFaqs((prevFaqs) =>
          prevFaqs.map((faq) =>
            faq._id === faqId
              ? { ...faq, status: faq.status === 'active' ? 'inactive' : 'active' }
              : faq,
          ),
        )
        toast.success(response.data.message || 'FAQ status updated successfully.')
      } else {
        toast.error(response?.data?.message || 'Failed to toggle status.')
      }
    } catch (err) {
      console.error('Toggle status error:', err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setToggleLoading((prev) => ({ ...prev, [faqId]: false }))
    }
  }


  const handleCreateFAQ = async () => {
    if (!createQuestion.trim() || !createAnswer.trim()) {
      toast.error('Please fill in both question and answer.')
      return
    }

    try {
      setLoading(true)
      const { response, error } = await apiHelper(
        'POST',
        '/admin/faqs',
        {},
        {
          question: createQuestion,
          answer: createAnswer,
        },
      )

      if (error) {
        toast.error(error || 'Failed to create FAQ.')
        return
      }

      if (response?.data?.status === 1) {
        toast.success(response.data.message || 'FAQ created successfully.')
        fetchFAQs(currentPage, searchTerm)
        setShowCreateModal(false)
        setCreateQuestion('')
        setCreateAnswer('')
      } else {
        toast.error(response?.data?.message || 'Create failed.')
      }
    } catch (err) {
      console.error('Create error:', err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (faq) => {
    setSelectedFaq(faq)
    setEditQuestion(faq.question)
    setEditAnswer(faq.answer)
    setShowEditModal(true)
  }

  const handleDelete = (faq) => {
    setSelectedFaq(faq)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedFaq?._id) return

    try {
      setLoading(true)
      const { response, error } = await apiHelper('DELETE', `/admin/faqs/${selectedFaq._id}`)

      if (error) {
        toast.error(error || 'Failed to delete FAQ.')
        return
      }

      if (response?.data?.status === 1) {
        toast.success(response.data.message || 'FAQ deleted successfully.')
        fetchFAQs(currentPage, searchTerm)
        setShowDeleteModal(false)
        setSelectedFaq(null)
      } else {
        toast.error(response?.data?.message || 'Delete failed.')
      }
    } catch (err) {
      console.error('Delete error:', err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEditSubmit = async () => {
    if (!selectedFaq?._id) return

    try {
      setLoading(true)
      const { response, error } = await apiHelper(
        'PUT',
        `/admin/faqs/${selectedFaq._id}`,
        {},
        {
          question: editQuestion,
          answer: editAnswer,
        },
      )

      if (error) {
        toast.error(error || 'Failed to update FAQ.')
        return
      }

      if (response?.data?.status === 1) {
        toast.success(response.data.message || 'FAQ updated successfully.')
        fetchFAQs(currentPage, searchTerm)
        setShowEditModal(false)
        setSelectedFaq(null)
        setEditQuestion('')
        setEditAnswer('')
      } else {
        toast.error(response?.data?.message || 'Update failed.')
      }
    } catch (err) {
      console.error('Update error:', err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CRow>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="heading">FAQ's</h4>
        <CButton color="cta" className="cta cta2" onClick={() => setShowCreateModal(true)}>
          <CIcon icon={cilPlus} className="me-2" />
          Create FAQ
        </CButton>
      </div>
      <CCol xs={12}>
        <CRow className="mb-3">
          <CCol md={6}>
            <CInputGroup className="searchfield">
              <CFormInput
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <CButton type="button" color="secondary" variant="outline">
                <CIcon icon={cilSearch} />
              </CButton>
            </CInputGroup>
          </CCol>
        </CRow>

        {loading ? (
          <div className="text-center">
            <CSpinner />
          </div>
        ) : (
          <CAccordion>
            {faqs.map((faq) => (
              <CAccordionItem key={faq._id} itemKey={faq._id}>
                <CAccordionHeader>
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <span className="flex-grow-1 me-2" style={{ wordBreak: 'break-word' }}>{faq.question}</span>
                    <span className='px-2 flex-shrink-0'>{getStatusBadge(faq.status)}</span>
                  </div>
                </CAccordionHeader>
                <CAccordionBody>
                  {faq.answer}
                  <div className="mt-3 d-flex justify-content-end flex-wrap gap-2">
                    <CButton
                      size="sm"
                      className={`${faq.status === 'active' ? 'high' : 'medium'}`}
                      onClick={() => handleToggleStatus(faq._id)}
                      disabled={toggleLoading[faq._id]}
                    >
                      {toggleLoading[faq._id] ? (
                        <CSpinner size="sm" />
                      ) : (
                        <>
                          <CIcon icon={cilArrowRight} className="me-1" />
                          {faq.status === 'active' ? 'Deactivate' : 'Activate'}
                        </>
                      )}
                    </CButton>
                    <CButton size="sm" className="medium" onClick={() => handleEdit(faq)}>
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton className="high" size="sm" onClick={() => handleDelete(faq)}>
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </div>
                </CAccordionBody>
              </CAccordionItem>
            ))}
          </CAccordion>
        )}
        {!loading && faqs.length === 0 && searchTerm && (
          <div className="text-center">No FAQs match your search</div>
        )}
        {!loading && faqs.length === 0 && <div className="text-center">No FAQs found</div>}
      </CCol>

      {/* Create FAQ Modal */}
      <CModal visible={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <CModalHeader>
          <CModalTitle>Create FAQ</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel htmlFor="faqQuestion">Question</CFormLabel>
              <CFormInput
                type="text"
                id="faqQuestion"
                value={createQuestion}
                onChange={(e) => setCreateQuestion(e.target.value)}
                placeholder="Enter FAQ question"
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="faqAnswer">Answer</CFormLabel>
              <CFormTextarea
                id="faqAnswer"
                rows={4}
                value={createAnswer}
                onChange={(e) => setCreateAnswer(e.target.value)}
                placeholder="Enter FAQ answer"
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </CButton>
          <CButton className="cta cta2" color="cta" onClick={handleCreateFAQ} disabled={loading}>
            {loading ? <CSpinner size="sm" /> : 'Create'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Edit FAQ Modal */}
      <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
        <CModalHeader>
          <CModalTitle>Edit FAQ</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel htmlFor="editQuestion">Question</CFormLabel>
              <CFormInput
                type="text"
                id="editQuestion"
                value={editQuestion}
                onChange={(e) => setEditQuestion(e.target.value)}
                placeholder="Enter FAQ question"
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="editAnswer">Answer</CFormLabel>
              <CFormTextarea
                id="editAnswer"
                rows={4}
                value={editAnswer}
                onChange={(e) => setEditAnswer(e.target.value)}
                placeholder="Enter FAQ answer"
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </CButton>
          <CButton className="cta cta2" color="cta" onClick={handleEditSubmit} disabled={loading}>
            {loading ? <CSpinner size="sm" /> : 'Update'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete FAQ Modal */}
      <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <CModalHeader>
          <CModalTitle>Delete FAQ</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete this FAQ: "{selectedFaq?.question}"?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </CButton>
          <CButton color="cta" className="cta cta2" onClick={handleDeleteConfirm} disabled={loading}>
            {loading ? <CSpinner size="sm" /> : 'Delete'}
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default FAQ
