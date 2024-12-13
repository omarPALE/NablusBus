import { Card, Button, Form, Input, Select, message } from "antd";
import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./styles/Buses.css";

const { Option } = Select;

const Buses = ({ showlink1, showlink2, showlink3, busData }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch bus data from backend

  // Button click handler to fetch bus data

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

  const handleUpdateBus = async (values) => {
    console.log("Form values for update:", values);
    setIsSubmitting(true);

    // Remove empty fields from the update payload except 'bus_id' (mandatory)
    const { bus_id, ...fields } = values;
    const updatePayload = { bus_id };

    Object.keys(fields).forEach((key) => {
      if (fields[key]) {
        updatePayload[key] = fields[key];
      }
    });

    try {
      const response = await axios.put(
        "http://localhost:5000/api/admin/updateBus",
        updatePayload
      );

      if (response.status === 200) {
        message.success("Bus information updated successfully!");
        form.resetFields();
      } else {
        message.error("Failed to update bus information. Please try again.");
      }
    } catch (error) {
      console.error("Error updating bus information:", error);
      message.error("An error occurred while updating the bus information.");
    } finally {
      setIsSubmitting(false);
    }
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
        {showlink1 && !showlink2 && !showlink3 && (
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
                label="driver_work_id"
                name="driver_work_id"
                rules={[
                  {
                    required: true,
                    message: "Please enter the driver work ID",
                  },
                  {
                    pattern: /^[0-9]{1,5}$/,
                    message:
                      "Driver ID must be a numeric value between 1 and 5 digits",
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
        {!showlink1 && showlink2 && !showlink3 && (
          <Card className="buses-card" title="Update Bus Info" bordered>
            <Form
              layout="vertical"
              onFinish={handleUpdateBus}
              initialValues={{
                status: "station",
              }}
            >
              {/* Bus ID */}
              <Form.Item
                label="Bus ID"
                name="bus_id"
                rules={[
                  { required: true, message: "Please enter the bus ID" },
                  {
                    pattern: /^[0-9]+$/,
                    message: "Bus ID must be a numeric value",
                  },
                ]}
              >
                <Input placeholder="Enter Bus ID" />
              </Form.Item>

              {/* Bus Worker ID */}
              <Form.Item
                label="driver_work_id"
                name="driver_work_id"
                rules={[
                  {
                    pattern: /^[0-9]{1,5}$/,
                    message:
                      "Bus Worker ID must be a numeric value between 1 and 5 digits",
                  },
                ]}
              >
                <Input placeholder="Enter Bus Worker ID" />
              </Form.Item>

              {/* Area */}
              <Form.Item
                label="Area"
                name="area"
                rules={[
                  {
                    pattern: /^[a-zA-Z\s]+$/,
                    message: "Area must contain only letters",
                  },
                ]}
              >
                <Input placeholder="Enter Area" />
              </Form.Item>

              {/* Status */}
              <Form.Item
                label="Status"
                name="status"
                rules={[
                  {
                    pattern: /^(station|on_trip|maintenance)$/,
                    message:
                      "Status must be 'station', 'on_trip', or 'maintenance'",
                  },
                ]}
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
                  Update Bus Info
                </Button>
              </Form.Item>
            </Form>
          </Card>
        )}

        {/* Display Bus Data */}
        {!showlink1 && !showlink2 && showlink3 && (
          <Card title="Bus Information" bordered>
            <div className="bus-list">
              {busData.length === 0 ? (
                <p>No buses available.</p>
              ) : (
                busData.map((bus) => (
                  <Card key={bus.bus_number} className="bus-item" bordered>
                    <p>
                      <strong>Bus Number:</strong> {bus.bus_number}
                    </p>
                    <p>
                      <strong>Capacity:</strong> {bus.capacity}
                    </p>
                    <p>
                      <strong>Area:</strong> {bus.area}
                    </p>
                    <p>
                      <strong>Status:</strong> {bus.status}
                    </p>
                    <p>
                      <strong>Driver Work ID:</strong> {bus.driver_work_id}
                    </p>
                  </Card>
                ))
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

Buses.propTypes = {
  showlink1: PropTypes.bool,
  showlink2: PropTypes.bool,
  showlink3: PropTypes.bool,
  fetchBuses: PropTypes.func,
  busData: PropTypes.array,
  isSubmitting: PropTypes.bool,
  handleFetchBuses: PropTypes.func,
  handleAddBus: PropTypes.func,
  handleUpdateBus: PropTypes.func,
};

export default Buses;
