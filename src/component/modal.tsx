import { Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import React from 'react'

interface Props {
    open: boolean,
    networkId?: number,
    account?: string,
    balance?: number | null,
    handleClose: () => void
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const ModalCustom:React.FC<Props> = ({open, networkId, account, balance, handleClose}) => {
    return (      
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            style={{alignSelf: 'center', width: '100%'}}
        >
        <>
            <TableContainer component={Paper} style={{maxWidth: 650, margin: '150px auto', padding: 15}}>
            <Typography variant="h5">Wallet details</Typography>
                <Table style={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Key</TableCell>
                            <TableCell align="right">Value</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>

                            <TableRow
                            key={account}
                            >
                                <TableCell component="th" scope="row">
                                    Account
                                </TableCell>
                                <TableCell align="right">{account}</TableCell>

                            </TableRow>
                            <TableRow
                            key={account}
                            >
                                <TableCell component="th" scope="row">
                                    Chain ID
                                </TableCell>
                                <TableCell align="right">{networkId}</TableCell>

                            </TableRow>
                            <TableRow
                            key={account}
                            >
                                <TableCell component="th" scope="row">
                                    Balance
                                </TableCell>
                                <TableCell align="right">{balance}</TableCell>

                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        </Modal>
      )
}


export default ModalCustom