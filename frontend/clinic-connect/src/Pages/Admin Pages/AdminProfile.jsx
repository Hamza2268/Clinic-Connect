import { useState } from "react";
import { Box, Card, CardContent, Typography, Avatar, Button, TextField, Grid, Divider, Chip, DialogActions, DialogContent, DialogTitle, Dialog, IconButton, InputAdornment } from "@mui/material";
import { Edit, Save, Cancel, Email, Phone, Badge, CalendarMonth, Security, VisibilityOff, Visibility } from "@mui/icons-material";
import AdminLayout from "../../Components/Admin Components/AdminLayout";

export default function AdminProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        firstName: "Admin",
        lastName: "User",
        email: "admin@clinicconnect.com",
        phone: "+1 234 567 8900",
        role: "System Administrator",
        department: "IT Administration",
        employeeId: "ADM-001",
        joinDate: "January 15, 2023",
    });

    const [editedProfile, setEditedProfile] = useState(profile);

    const handleSave = () => {
        setProfile(editedProfile);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedProfile(profile);
        setIsEditing(false);
    };

    // Common styles for the cards to avoid repetition
    const cardStyles = "rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#f0f0f0]";
    const tealColor = "#26a69a";
    const [changePass, setChangePass] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    return (
        <AdminLayout>
            <Box className="max-w-[1200px]">
                {/* Page Header */}
                <Box className="mb-8">
                    <Typography variant="h4" fontWeight={700}>My Profile</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage your admin account information.
                    </Typography>
                </Box>

                {/* Profile Layout */}
                <Box className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6">

                    {/* Left Sidebar - Profile Card */}
                    <Card className={`${cardStyles} md:row-span-2`}>
                        <CardContent className="!p-8">
                            {/* Avatar Section */}
                            <Box className="flex flex-col items-center text-center mb-4">
                                <Avatar
                                    className="!w-[100px] !h-[100px] !text-[2.5rem] mb-4"
                                    sx={{ bgcolor: tealColor }}
                                >
                                    {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                                </Avatar>
                                <Typography variant="h5" fontWeight={600}>{profile.firstName} {profile.lastName}</Typography>
                                <Chip label={profile.role} color="primary" sx={{ mt: 1 }} />
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            {/* Quick Info */}
                            <Box className="flex flex-col gap-4">
                                <Box className="flex items-center gap-3">
                                    <Email sx={{ color: tealColor }} />
                                    <Typography variant="body2">{profile.email}</Typography>
                                </Box>
                                <Box className="flex items-center gap-3">
                                    <Phone sx={{ color: tealColor }} />
                                    <Typography variant="body2">{profile.phone}</Typography>
                                </Box>
                                <Box className="flex items-center gap-3">
                                    <Badge sx={{ color: tealColor }} />
                                    <Typography variant="body2">{profile.employeeId}</Typography>
                                </Box>
                                <Box className="flex items-center gap-3">
                                    <CalendarMonth sx={{ color: tealColor }} />
                                    <Typography variant="body2">Joined {profile.joinDate}</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Main Content - Details Card */}
                    <Card className={cardStyles}>
                        <CardContent className="!p-6 sm:!p-8">
                            <Box className="flex justify-between items-center mb-4">
                                <Typography variant="h6" fontWeight={600}>Profile Details</Typography>
                                {!isEditing ? (
                                    <Button startIcon={<Edit />} onClick={() => setIsEditing(true)} className="!text-[#006A67]">
                                        Edit Profile
                                    </Button>
                                ) : (
                                    <Box display="flex" gap={1}>
                                        <Button startIcon={<Cancel />} onClick={handleCancel} color="inherit">
                                            Cancel
                                        </Button>
                                        <Button startIcon={<Save />} onClick={handleSave} variant="contained" className="!bg-[#334443]">
                                            Save Changes
                                        </Button>
                                    </Box>
                                )}
                            </Box>

                            <Grid container spacing={3} sx={{ mt: 1 }}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Name"
                                        value={editedProfile.firstName + " " + editedProfile.lastName}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, firstName: e.target.value })}
                                        fullWidth
                                        disabled={!isEditing}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Email Address"
                                        value={editedProfile.email}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                                        fullWidth
                                        disabled={!isEditing}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Phone Number"
                                        value={editedProfile.phone}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                                        fullWidth
                                        disabled={!isEditing}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Security Card */}
                    <Card className={cardStyles}>
                        <CardContent className="!p-6 sm:!p-8 !pd-0">
                            <Box className="flex justify-between items-center mb-4">
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Security sx={{ color: tealColor }} />
                                    <Typography variant="h6" fontWeight={600}>Security</Typography>
                                </Box>
                            </Box>
                            <Box className="flex flex-col gap-3 mt-4">
                                <Button
                                    variant="outlined"
                                    fullWidth onClick={() => setChangePass(true)}
                                    className={` !rounded-xl hover:!bg-[#334443] hover:!text-white`} style={{ color: "#334443", }}
                                >
                                    Change Password</Button>
                                {/* <Button variant="outlined" color="error" fullWidth>View Login Activity</Button> */}
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* Changing Password */}
            <Dialog
                open={changePass}
                onClose={() => { setChangePass(false); }}
                PaperProps={{ sx: { borderRadius: '16px', width: "30%", padding: 2 } }}
            >
                <DialogTitle className='!pl-0' sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                    Changing Password
                </DialogTitle>
                <DialogContent
                    className='!pl-0'>
                    <p className="text-[hsl(215,15%,50%)]">
                        Confirm your Password
                    </p>
                </DialogContent>
                <TextField
                    label="Current Password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    fullWidth
                    className='mb-2 '
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    edge="end"
                                >
                                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    label="New Password"
                    type={showNewPassword ? 'text' : 'password'}
                    fullWidth
                    className='mb-2 '
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    edge="end"
                                >
                                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => { setChangePass(false) }} sx={{ color: 'hsl(215, 15%, 50%)' }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => { setChangePass(false) }}
                        sx={{
                            bgcolor: 'hsl(174, 62%, 40%, 0.9)',
                            borderRadius: '10px',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': { bgcolor: 'hsl(174, 62%, 40%, 0.8)' },
                        }}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </AdminLayout>
    );
}