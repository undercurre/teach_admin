import { createQuestion, CreateQuestionParams } from '@/apis/question';
import {
  PageContainer,
  ProForm,
  ProFormInstance,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Card, message } from 'antd';
import { useRef, type FC } from 'react';
const BasicForm: FC<Record<string, any>> = () => {
  const formRef = useRef<ProFormInstance>();

  const { run } = useRequest(createQuestion, {
    manual: true,
    onSuccess: () => {
      formRef.current?.resetFields();
      message.success('提交成功');
    },
  });
  const onFinish = async (values: Record<string, any>) => {
    run(values as CreateQuestionParams);
  };

  return (
    <PageContainer content="提交表单录入资源">
      <Card bordered={false}>
        <ProForm
          formRef={formRef}
          hideRequiredMark
          style={{
            margin: 'auto',
            marginTop: 8,
            maxWidth: 600,
          }}
          name="basic"
          layout="vertical"
          initialValues={{
            public: '1',
          }}
          onFinish={onFinish}
        >
          <ProFormTextArea
            label="标题"
            width="xl"
            name="content"
            rules={[
              {
                required: true,
                message: '请输入资源标题',
              },
            ]}
            placeholder="请输入资源标题"
          />

          <ProFormTextArea
            label="描述"
            name="answer"
            width="xl"
            rules={[
              {
                required: true,
                message: '请输入资源描述',
              },
            ]}
            placeholder="请输入资源描述"
          />

          <ProFormTextArea
            label="链接"
            name="answer"
            width="xl"
            rules={[
              {
                required: true,
                message: '请输入资源链接',
              },
            ]}
            placeholder="请输入资源链接"
          />
        </ProForm>
      </Card>
    </PageContainer>
  );
};
export default BasicForm;
