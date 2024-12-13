import { Card, Button, Form, Input, Select, message } from "antd";
import { useState } from "react";
import PropTypes from "prop-types";
import "./styles/Buses.css";

const { Option } = Select;

const Buses = ({ show }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddBus = (values) => {
    console.log("Form values:", values);
    setIsSubmitting(true);

    // Simulate an API call
    setTimeout(() => {
      console.log("Bus added:", values);
      message.success("Bus added successfully!");
      setIsSubmitting(false);
      form.resetFields();
    }, 1000);
  };

  const handleUpdateBus = () => {
    console.log("Update bus info clicked");
    // Add your logic to handle updating bus information here
  };

  return (
    <div className="buses-container">
      <h2 className="buses-header">Manage Buses</h2>
      <p className="buses-description">
        Here you can manage buses, add new ones, or update existing bus
        information.
      </p>
      <div className="buses-cards">
        {/* Add New Bus Card */}
        {show && (
          <Card className="buses-card" title="Add a New Bus" bordered>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleAddBus}
              initialValues={{
                status: "station",
              }}
            >
              {/* Bus Number */}
              <Form.Item
                label="Bus Number"
                name="bus_number"
                rules={[
                  { required: true, message: "Please enter the bus number" },
                  {
                    pattern: /^[0-9]+$/,
                    message: "Bus number must be numeric",
                  },
                ]}
              >
                <Input placeholder="Enter bus number" />
              </Form.Item>

              {/* Capacity */}
              <Form.Item
                label="Capacity"
                name="capacity"
                rules={[
                  { required: true, message: "Please enter the capacity" },
                  {
                    pattern: /^[0-9]+$/,
                    message: "Capacity must be numeric",
                  },
                ]}
              >
                <Input placeholder="Enter bus capacity" />
              </Form.Item>

              {/* Area */}
              <Form.Item
                label="Area"
                name="area"
                rules={[
                  { required: true, message: "Please enter the area" },
                  {
                    pattern: /^[a-zA-Z\s]+$/,
                    message: "Area must contain only letters",
                  },
                ]}
              >
                <Input placeholder="Enter bus area" />
              </Form.Item>

              {/* Status */}
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: "Please select a status" }]}
              >
                <Select>
                  <Option value="station">Station</Option>
                  <Option value="on_trip">On Trip</Option>
                  <Option value="maintenance">Maintenance</Option>
                </Select>
              </Form.Item>

              {/* Submit Button */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  block
                >
                  Add Bus
                </Button>
              </Form.Item>
            </Form>
          </Card>
        )}

        {/* Update Bus Info Card */}
        <Card
          className="buses-card"
          title="Update Bus Info"
          bordered
          actions={[
            <Button key="1" type="primary" onClick={handleUpdateBus}>
              Update Info
            </Button>,
          ]}
        >
          <p>Update information for an existing bus in the system.</p>
        </Card>
      </div>
    </div>
  );
};
Buses.propTypes = {
  show: PropTypes.bool,
};
export default Buses;
