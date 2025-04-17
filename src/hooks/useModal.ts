import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personalizado para gerenciar o estado de um modal
 * @returns Objeto com estado e funções para controlar o modal
 */
function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<any>(null);

  // Abrir o modal com dados opcionais
  const openModal = useCallback((modalData?: any) => {
    setData(modalData);
    setIsOpen(true);
    document.body.style.overflow = 'hidden'; // Impedir rolagem do body quando modal estiver aberto
  }, []);

  // Fechar o modal
  const closeModal = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = ''; // Restaurar rolagem do body
  }, []);

  // Alternar estado do modal
  const toggleModal = useCallback((modalData?: any) => {
    if (isOpen) {
      closeModal();
    } else {
      openModal(modalData);
    }
  }, [isOpen, openModal, closeModal]);

  // Limpar efeitos ao desmontar o componente
  useEffect(() => {
    return () => {
      document.body.style.overflow = ''; // Garantir que a rolagem seja restaurada se o componente for desmontado
    };
  }, []);

  return {
    isOpen,
    data,
    openModal,
    closeModal,
    toggleModal
  };
}

export default useModal;
