type Value = string | number | boolean;

namespace GM {
  function setValue(key: string, value: Value): Promise<void>;

  function getValue(key: string, defaultValue?: Value): Promise<Value | undefined>;
}
