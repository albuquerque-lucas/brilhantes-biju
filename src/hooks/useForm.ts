import { useState, useEffect } from 'react';

/**
 * Hook personalizado para gerenciar formulários com validação
 * @param initialValues Valores iniciais do formulário
 * @param validate Função de validação
 * @returns Objeto com valores, erros, manipuladores de eventos e métodos de submissão
 */
function useForm<T extends Record<string, any>>(
  initialValues: T,
  validate: (values: T) => Partial<Record<keyof T, string>>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validar quando os valores mudam e o formulário foi tocado
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
    }
  }, [values, touched]);

  // Manipulador de mudança para inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Tratar checkbox separadamente
    if (type === 'checkbox' && 'checked' in e.target) {
      setValues({
        ...values,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setValues({
        ...values,
        [name]: value
      });
    }
  };

  // Manipulador de blur para marcar campo como tocado
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
  };

  // Manipulador de submissão
  const handleSubmit = (callback: (values: T) => void) => (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marcar todos os campos como tocados
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key as keyof T] = true;
      return acc;
    }, {} as Partial<Record<keyof T, boolean>>);
    
    setTouched(allTouched);
    
    // Validar todos os campos
    const validationErrors = validate(values);
    setErrors(validationErrors);
    
    // Se não houver erros, submeter o formulário
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      callback(values);
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  // Definir valor específico
  const setValue = (name: keyof T, value: any) => {
    setValues({
      ...values,
      [name]: value
    });
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValue
  };
}

export default useForm;
