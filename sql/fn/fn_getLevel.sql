USE [DV]
GO
/****** Object:  UserDefinedFunction [dbo].[fn_getLevel]    Script Date: 2024/2/18 下午 01:50:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO
Create OR ALTER function [dbo].[fn_getLevel](@CID int)
	returns int
as
begin
	return (select nLevel from Class where CID = @CID) + 1
end
