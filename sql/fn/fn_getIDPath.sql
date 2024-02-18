USE [DV]
GO
/****** Object:  UserDefinedFunction [dbo].[fn_getIDPath]    Script Date: 2024/2/18 下午 01:50:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO

--取得IDPath資料
Create OR ALTER function [dbo].[fn_getIDPath](@PCID int, @CID int)
	returns varchar(255)
as
begin
	declare @nLevel int = (select nLevel from Class where CID = @PCID)
	declare @IDPath nvarchar(900)
	if (@nLevel is NULL)
		set @IDPath = convert(nvarchar(max), @CID)
	else
		set @IDPath = (select IDPath + '/' + convert(nvarchar(max), @CID) from Class where CID = @PCID)
	return @IDPath
end
