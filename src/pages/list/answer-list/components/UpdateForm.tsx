import { Answer } from '@/apis/question';
import { InputNumber, InputNumberProps, Modal } from 'antd';
import React from 'react';

export type UpdateFormProps = {
  onCancel: () => void;
  onSubmit: (value: number) => void;
  updateModalVisible: boolean;
  values: Partial<Answer>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  let current = props.values.score;

  const onChange: InputNumberProps['onChange'] = (value) => {
    console.log('changed', value);
    current = value as number;
  };

  function handleSubmit() {
    if (current) props.onSubmit(current);
  }

  return (
    <Modal
      width={640}
      bodyStyle={{
        padding: '32px 40px 48px',
      }}
      destroyOnClose
      title="评分"
      open={props.updateModalVisible}
      onCancel={() => {
        props.onCancel();
      }}
      onOk={handleSubmit}
    >
      <InputNumber min={0} max={100} defaultValue={props.values.score} onChange={onChange} />
    </Modal>
  );
};

export default UpdateForm;
