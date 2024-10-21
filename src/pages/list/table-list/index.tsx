import { getQuestions, Question } from '@/apis/question';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
/**
 * 更新节点
 *
 * @param fields
 */

const handleUpdate = async (fields: FormValueType, currentRow?: Question) => {
  console.log(fields, currentRow);
  const hide = message.loading('正在配置');

  try {
    // 请求更新接口
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

const TableList: React.FC = () => {
  /** 分布更新窗口的弹窗 */

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<Question>();
  /** 国际化配置 */

  const columns: ProColumns<Question>[] = [
    {
      title: '标题',
      dataIndex: 'content',
      render: (dom) => {
        return <div>{dom}</div>;
      },
    },
    {
      title: '链接',
      dataIndex: 'answer',
      valueType: 'textarea',
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      renderFormItem: (item, {}, form) => {
        return form.getFieldValue('createdAt');
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<Question>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="key"
        search={false}
        toolBarRender={() => []}
        request={getQuestions}
        columns={columns}
      />
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value, currentRow);

          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.content && (
          <ProDescriptions<Question>
            column={2}
            title={currentRow?.content}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.content,
            }}
            columns={columns as ProDescriptionsItemProps<Question>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
