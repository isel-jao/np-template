export type ModelType = {
  name: string;
  id?: {
    name: string;
    type: string;
  };
  attributes: Record<
    string,
    {
      isEnum: boolean;
      isFile: boolean;
      type: string;
      isRequired: boolean;
      validations: string[];
    }
  >;
};
