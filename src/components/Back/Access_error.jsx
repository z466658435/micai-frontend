import React from 'react'
import {
  Space,
  Alert,
} from 'antd'

function Access_error() {
  return (
    <div>
      <Space
        direction="vertical"
        style={{
          width: '100%',
        }}>
        <Alert
          message="Access Error"
          description="无访问权限，请联系管理员"
          type="error"
          showIcon
          closable
        />
      </Space>
    </div>
  )
}

export default Access_error