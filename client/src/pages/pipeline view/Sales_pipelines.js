import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./style.css";
// import Card from './Card.js';
import { Button, Select, Spin, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AddCardModal from "./AddCardModal";
import axios from "axios";
import user from '../../assets/images/user.png'
import edit from '../../assets/images/edit.png'
import Delete from '../../assets/images/delete.png'

import moment from "moment";
import NothingToShow from "./NothingToShow";
import AddColModal from "./AddColModal";
import ThreeDotSelect from "./ThreeDotSelect";
import Swal from "sweetalert2";
import { useStateContext } from "../../contexts/ContextProvider";


const initialCards = {
  // "5": { id: "5", content: <Card /> },
  // "6": { id: '6', content: <Card /> },

  // Add more cards here
};

const Sales_pipelines = () => {

  const {
    pipelines,
    setPipelines,
    selectedPipelineId,
    setSelectedPipelineId,
    selectedPipelineName,
    setSelectedPipelineName,
    selectedPipeline, setSelectedPipeline
  } = useStateContext()
  const [loading, setLoading] = useState(false)
  const [columns, setColumns] = useState([]);
  const [cards, setCards] = useState(initialCards);
  const [visible, setVisible] = useState(false);
  const [visibleColModal, setVisibleColModal] = useState(false);

  const [clickedCol, setClickedCol] = useState();

  const [fetchAgain, setFetchAgain] = useState(false)

  const [cardId, setCardId] = useState()

  const [stageId, setStageId] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`/pipeline/get`);
      const data = res.data?.data;
      // setSelectedPipelineName(data[0]?.name)
      setPipelines(data);
      // setSelectedPipeline(data[0])
      // setSelectedPipelineId(data[0]?.pip_id)
    };
    fetchData();
  }, []);

  const handleEdit = (cardId) => {
    setCardId(cardId)
    setVisible(true);
  }
  const updateDeal = async (deal_status, deal_id) => {
    try {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `Yes, ${deal_status} it!`
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Modified!',
            'Deal status has been modified',
            'success'
          )
          const obj = {
            deal_status: deal_status
          }
          await axios.put(`/deal/${deal_id}/update_deal_status`, obj);
          setFetchAgain(!fetchAgain)
        }
      })

    } catch (error) {
      message.error("Error in updating deal")
    }
  }

  const handleEditStage = (columnId) => {
    setStageId(columnId)
    setVisibleColModal(true)
  }

  const handleDeleteDeal = (deal_id, deal_value) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
        axios.delete(`/deal/${deal_id}/delete?pip_id=${selectedPipelineId}&deal_value=${deal_value}`);
        setFetchAgain(!fetchAgain)
      }
    })
  }

  useEffect(() => {
    if (selectedPipeline) {
      const fetchData = async () => {
        setLoading(true)
        await axios.get(`/pipeline/${selectedPipeline?.pip_id}/get-pipeline-view`).then((res) => {
          setColumns(res.data)
          let ic = {};
          const data = res.data;
          data.map((d) => {
            const ids = d.cardIds;
            const details = d.cardDeatils;

            ids.map((id, index) => {
              ic[id] = {
                id: id, content:
                  <div className="">
                    <div className='card-header'>
                      <div className='avatar'>{details[index]?.lead_type_value.charAt(0)}</div>    {/* person/organization name ka avatar*/}
                      <div style={{ paddingRight: '80px' }}>
                        <div className=''>{selectedPipeline?.name}</div>  {/* pipeline name */}
                        <div style={{ color: '#38abb3' }}>
                          {details[index]?.title.slice(0, 20)}
                          {details[index]?.title.length > 20 ? "..." : ""}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', marginLeft: '14.5rem', position: 'absolute' }}>
                        <img src={edit} alt="icon" className='user-icon' role="button" onClick={() => handleEdit(id)} />
                        <img src={Delete} alt="icon" className='user-icon' role="button" 
                        onClick={() => handleDeleteDeal(id, details[index]?.deal_value)} 
                        />
                        {/* <ThreeDotSelect/> */}
                      </div>
                    </div>
                    <div className='card-header'>
                      <img src={user} alt='icon' className='user-icon' />
                      <div style={{ color: '#38abb3' }}>{details[index]?.lead_type_value}</div>   {/* person/organization name */}
                    </div>
                    <div className='card-header' style={{ justifyContent: 'space-between' }}>
                      <div className=''>Activity</div>    {/* description */}
                      <div className='activity'>{details[index]?.activity}</div>  {/* sales value */}
                    </div>
                    <div className='card-header' style={{ justifyContent: 'space-between' }}>
                      <div className=''>Deal value</div>    {/* description */}
                      <div style={{ color: '#38abb3' }}>$ {details[index]?.deal_value}</div>  {/* sales value */}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div className='activity' role="button" onClick={() => updateDeal("won", id)}>Won</div>
                      <div className='loss' role="button" onClick={() => updateDeal("loss", id)}>Loss</div>
                      <div className='footer'>Created at: {moment(details[index]?.created_at).format('MMM DD, YYYY')}</div>
                    </div>
                  </div>
              }
            })
          })
          setCards(ic)
          setLoading(false)

        }).catch((err) => {
          setLoading(false)
          message.error("Error in fetching pipeline data")
        })

      }
      fetchData();
    }

  }, [selectedPipelineId, fetchAgain])

  const handlePipelineSelect = (value) => {
    setSelectedPipelineName(value)
    pipelines.map((pipeline) => {
      if (pipeline.name === value) {
        setSelectedPipelineId(pipeline.pip_id)
        setSelectedPipeline(pipeline)
      }
    })
  }

  const handleCreateCard = (columnId) => {
    setClickedCol(columnId)
    setVisible(true)
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    // console.log(result)
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceColumn = columns.find((col) => col.id === source.droppableId);
    // console.log(sourceColumn.id)
    const destinationColumn = columns.find((col) => col.id === destination.droppableId);
    // console.log(destinationColumn.id)


    if (sourceColumn.id === destinationColumn.id) {
      const newCardIds = Array.from(sourceColumn.cardIds);
      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, result.draggableId);

      setColumns((prev) => {
        let arr = [...prev];
        arr.map((obj) => {
          if (obj.id === sourceColumn.id) {
            return { ...obj, cardIds: newCardIds };
          }
          return obj; // Keep other objects unchanged
        });
        return arr;
      })

    }
    else {
      const sourceCardIds = Array.from(sourceColumn.cardIds);
      console.log(sourceColumn)
      console.log(source.index)
      const price = parseInt(sourceColumn.cardDeatils[source.index]?.deal_value);
      console.log(price)
      const sourceTitle = {
        ...sourceColumn.title,
        price: sourceColumn.title.price - price
      };
      const sourceCardDetails = Array.from(sourceColumn.cardDeatils);
      const cardDetails = sourceCardDetails.splice(source.index, 1)[0];

      console.log(sourceCardDetails)

      const destinationCardIds = Array.from(destinationColumn.cardIds);
      const destinationTitle = {
        ...destinationColumn.title,
        price: destinationColumn.title.price + price
      };
      const destinationCardDetails = [...destinationColumn.cardDeatils];
      destinationCardDetails[destination.index] = cardDetails;

      console.log(destinationCardDetails)

      sourceCardIds.splice(source.index, 1);
      destinationCardIds.splice(destination.index, 0, result.draggableId);


      setColumns((prev) => {
        return prev.map((obj) => {
          if (obj.id === sourceColumn.id) {
            return { ...obj, title: sourceTitle, cardIds: sourceCardIds, cardDeatils: sourceCardDetails };
          }
          if (obj.id === destinationColumn.id) {
            return { ...obj, title: destinationTitle, cardIds: destinationCardIds, cardDeatils: destinationCardDetails };
          }
          return obj; // Keep other objects unchanged
        });
      });

      const values = {
        stage_id: destinationColumn.id
      }
      try {
        await axios.put(`/deal/${draggableId}/update_stageid`, values);
        // setFetchAgain(!fetchAgain)
      } catch (err) {
        message.error('Error in updating deals');
      }

    }
  };

  return (
    <>
      <AddCardModal
        visible={visible}
        setVisible={setVisible}
        clickedCol={clickedCol}
        columns={columns}
        setColumns={setColumns}
        cards={cards}
        setCards={setCards}
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
        cardId={cardId}
      />

      <AddColModal
        visible={visibleColModal}
        setVisible={setVisibleColModal}
        selectedPipelineId={selectedPipelineId}
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
        stageId={stageId}
      />

      <div className="p-8">

        <Select
          style={{
            width: 150,
            marginBottom: '10px'
          }}
          value={selectedPipeline?.name}
          // defaultValue={selectedPipeline?.name}
          onChange={handlePipelineSelect}
          options={
            pipelines.map((val) => {
              return (
                {
                  value: val.name,
                  label: val.name,
                }
              )
            })
          }
        />

        {selectedPipelineId ?
          <DragDropContext onDragEnd={handleDragEnd}>
            {!loading ? <div className="board">
              {columns.map((column) => (
                <div className="column" key={column.id}>

                  <div className="column-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div >
                      <h2>{column.title.stageName}</h2>
                      <ul className="column-header-list text-sm">
                        <li>₹ {column.title.price}</li>
                        <li style={{ marginLeft: '20px' }}>• {column.cardIds.length} Deal</li>
                      </ul>
                    </div>

                    <div style={{ display: 'flex', marginTop: '10px', gap: '10px' }}>
                      <img src={edit} alt="icon" className='user-icon' role="button" onClick={() => handleEditStage(column.id)} />
                      {/* <img src={Delete} alt="icon" className='user-icon' role="button" onClick={() => handleDeleteStage(column.id)} /> */}
                    </div>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div
                        className="card-list"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {column.cardIds.length > 0 && column.cardIds.map((cardId, index) => {
                          const card = cards[cardId];

                          return (
                            <Draggable
                              key={card?.id}
                              draggableId={card?.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  className="card"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  {card?.content}
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <div className="add-card">

                    <Button onClick={() => handleCreateCard(column.id)} className="add-card-button punch" >
                      <PlusOutlined />Add Card
                    </Button>
                  </div>
                </div>
              ))}
              <div role="button" className="add-column" onClick={() => setVisibleColModal(true)}> <PlusOutlined /> Add column</div>
            </div>
              :
              <Spin style={{ width: '100%' }} />
            }
          </DragDropContext>
          :
          <NothingToShow />
        }

      </div>
    </>
  );
};

export default Sales_pipelines;
