import { createRef, FC } from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';

import { Form } from './styles';
import { Modal } from '../Modal';
import Input from '../Input';

type FoodData = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
}

interface ModalAddFoodProps {
  setIsOpen: () => void;
  handleAddFood: (data: FoodData) => Promise<void>;
  isOpen: boolean;
}

export const ModalAddFood: FC<ModalAddFoodProps> = ({ 
  isOpen, 
  setIsOpen, 
  handleAddFood 
}) => {
  const formRef = createRef<FormHandles>();

  const handleSubmit = async (data: FoodData) => {
    handleAddFood(data);
    setIsOpen();
  }

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <h1>Novo Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />
        <button type="submit" data-testid="add-food-button">
          <p className="text">Adicionar Prato</p>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
}