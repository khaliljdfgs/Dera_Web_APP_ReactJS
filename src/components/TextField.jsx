import React from 'react'
import { Form } from 'react-bootstrap'

const TextField = ({
  label, placeholder, name, formik,
  disable = false,
  hasFieldArrayError = false,
  value = '',
  error = null,
  type = 'text',
  multiline = false
}) => {
  return (
    <Form.Group className='mb-3'>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        placeholder={placeholder}
        name={name}
        as={multiline ? 'textarea' : 'input'}
        rows={multiline ? 5 : 1}
        style={{ resize: 'none' }}
        onChange={formik.handleChange}
        value={hasFieldArrayError ? value : formik.values[name]}
        disabled={disable} />

      {formik.errors[name] && formik.touched[name]
        ? <Form.Text className='text-danger'>{formik.errors[name]}</Form.Text> : null}

      {hasFieldArrayError ?
        formik.getFieldMeta(name).error
          ? <Form.Text className='text-danger'>{formik.getFieldMeta(name).error}</Form.Text>
          : null
        : ''}
    </Form.Group>
  )
}

export default TextField