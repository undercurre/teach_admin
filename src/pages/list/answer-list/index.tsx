import { Answer, getAnswers, updateAnswers } from '@/apis/question';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Drawer } from 'antd';
import React, { useRef, useState } from 'react';
import UpdateForm from './components/UpdateForm';

const TableList: React.FC = () => {
  /** 分布更新窗口的弹窗 */

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<Answer>();

  async function onUpdatedSubmit(value: number) {
    if (currentRow && actionRef.current) {
      await updateAnswers(currentRow?.id, { score: value });
      actionRef.current.reload();
      handleUpdateModalVisible(false);
    }
  }

  function onUpdatedCancel() {
    handleUpdateModalVisible(false);
  }

  /** 国际化配置 */

  const columns: ProColumns<Answer>[] = [
    {
      title: '问题',
      dataIndex: 'question',
      render: (dom, entity) => {
        return <div>{entity.question.content}</div>;
      },
    },
    {
      title: '此次答案',
      dataIndex: 'userAnswer',
      valueType: 'textarea',
    },
    {
      title: '标准答案',
      dataIndex: 'answer',
      valueType: 'textarea',
      render: (dom, entity) => {
        return <div>{entity.question.answer}</div>;
      },
    },
    {
      title: '成绩',
      dataIndex: 'score',
      valueType: 'textarea',
    },
    {
      title: '答题时间',
      sorter: true,
      dataIndex: 'answeredAt',
      valueType: 'dateTime',
      renderFormItem: (item, {}, form) => {
        return form.getFieldValue('createdAt');
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          评分
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<Answer>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="key"
        search={false}
        toolBarRender={() => []}
        request={getAnswers}
        columns={columns}
      />
      <UpdateForm
        values={currentRow || {}}
        updateModalVisible={updateModalVisible}
        onCancel={onUpdatedCancel}
        onSubmit={onUpdatedSubmit}
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
        {currentRow?.userAnswer && (
          <ProDescriptions<Answer>
            column={2}
            title={currentRow?.userAnswer}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.userAnswer,
            }}
            columns={columns as ProDescriptionsItemProps<Answer>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
