USE [DV]
GO

CREATE
  OR

ALTER PROCEDURE xp_deleteObject @OID INT
AS
BEGIN
  DELETE
  FROM [CO]
  WHERE OID = @OID;

  DELETE
  FROM [ORel]
  WHERE OID1 = @OID

  DELETE
  FROM [Object]
  WHERE OID = @OID
END
GO


