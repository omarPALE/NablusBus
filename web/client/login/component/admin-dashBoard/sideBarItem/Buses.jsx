import { Card, Button, Form, Input, Select, message } from "antd";
import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./styles/Buses.css";

const { Option } = Select;

const Buses = ({ show, hide }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkDriverIdExists = async (driverId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/driver/${driverId}`
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error checking driver work ID:", error);
      message.error("Failed to check Driver Work ID. Please try again later.");
      return false;
    }
  };

  const handleAddBus = async (values) => {
    console.log("Form values:", values);
    setIsSubmitting(true);

    try {
      const driverExists = await checkDriverIdExists(values.driver_work_id);

      if (!driverExists) {
        message.error("Driver Work ID does not exist in the database.");
        setIsSubmitting(false);
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:5000/api/admin/addBus",
          {
            bus_number: values.bus_number,
            capacity: values.capacity,
            area: values.area,
            driver_work_id: values.driver_work_id,
            status: values.status,
          }
        );

        if (response.status === 201) {
          message.success("Bus added successfully!");
          form.resetFields();
        } else {
          message.error("Failed to add the bus. Please try again.");
        }
      } catch (error) {
        console.error("Error adding bus:", error);
        message.error("An error occurred while adding the bus.");
      } finally {
        setIsSubmitting(false);
      }
    } catch (error) {
      message.error("An error occurred while validating the driver.", error);
      setIsSubmitting(false);
    }
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
        {show && !hide && (
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

              {/* Driver Work ID */}
              <Form.Item
                label="Driver Work ID"
                name="driver_work_id"
                rules={[
                  {
                    required: true,
                    message: "Please enter the driver work ID",
                  },
                  {
                    pattern: /^[0-9]{1,5}$/,
                    message:
                      "Driver Work ID must be numeric and not more than 5 digits",
                  },
                ]}
              >
                <Input placeholder="Enter driver work ID" />
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
        {!show && hide && (
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
        )}
      </div>
    </div>
  );
};

Buses.propTypes = {
  show: PropTypes.bool,
  hide: PropTypes.bool,
};

export default Buses;
