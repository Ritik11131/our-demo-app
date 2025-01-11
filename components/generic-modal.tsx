// components/GenericModal.tsx
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Form } from "@nextui-org/form";
import { Radio, RadioGroup } from "@nextui-org/radio";

interface InputField {
  label: string;
  name: string;
  placeholder: string;
  type: string;
  isRequired?: boolean;
  validate?: (value: string) => string | null; // Optional validation function
  options?: any; // Optional options for select or radio fields
}

interface GenericModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  inputFields: InputField[];
  onClose?: () => void; // Callback for close action
  onConfirm?: (values: any) => void; // Callback for confirm action
}

const GenericModal: React.FC<GenericModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  inputFields,
  onClose,
  onConfirm,
}) => {
  const submitButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const [submitted, setSubmitted] = React.useState<Record<
    string,
    string
  > | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    if (onConfirm) {
      onConfirm(data as Record<string, string>);
    }
    setSubmitted(data as Record<string, string>);
    onOpenChange(false); // Close the modal after submission
  };

  const handleFooterSubmit = () => {
    // Trigger the submit button click from the footer
    submitButtonRef.current?.click();
  };

  return (
    <Modal
      size="2xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <Form
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
            validationBehavior="native"
            onSubmit={onSubmit}
          >
            {inputFields.map((field) => {
              return field.type === "radio" ? (
                <RadioGroup
                  orientation="horizontal"
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  isRequired={field.isRequired}
                >
                  {field.options?.map((option: any, index: any) => (
                    <Radio key={index} value={option.name}>
                      {option.label}
                    </Radio>
                  ))}
                </RadioGroup>
              ) : field.type === 'textarea' ? (
                <Textarea
                  key={field.name}
                  isRequired={field.isRequired}
                  label={field.label}
                  labelPlacement="outside"
                  name={field.name}
                  placeholder={field.placeholder}
                  type={field.type}
                  validate={field.validate}
                />
              ) : (
                <Input
                  key={field.name}
                  isRequired={field.isRequired}
                  label={field.label}
                  labelPlacement="outside"
                  name={field.name}
                  placeholder={field.placeholder}
                  type={field.type}
                  validate={field.validate}
                />
              );
            })}

            <div className="w-full mt-4 mb-4 gap-4 hidden">
              <Button color="primary" type="submit" ref={submitButtonRef}>
                Submit
              </Button>
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="flat"
            onPress={() => {
              onClose && onClose();
              onOpenChange(false);
            }}
          >
            Close
          </Button>
          <Button color="primary" onPress={handleFooterSubmit}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GenericModal;
